<?php
// Notion API service

if (!defined('NOTION_TOKEN') || !defined('DATABASES')) {
    throw new Exception('Notion configuration missing. Please check config.php file.', 500);
}

/**
 * Fetch data from Notion database
 * @param string
 * @return array
 * @throws Exception
 */
function fetchNotionData(string $key): array
{
    if (!isset(DATABASES[$key])) {
        throw new Exception("Database key '$key' not found in config.");
    }

    $databaseId = DATABASES[$key];
    $url = "https://api.notion.com/v1/databases/$databaseId/query";

    return executeNotionApiCallWithRetry($url);
}

/**
 * Execute Notion API call with retry logic
 * @param string
 * @param int
 * @param float
 * @return array
 * @throws Exception
 */
function executeNotionApiCallWithRetry(string $url, int $maxRetries = 3, float $baseDelay = 1): array
{
    $lastException = null;

    for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
        try {
            return executeNotionApiCall($url);
        } catch (Exception $e) {
            $lastException = $e;
            $isLastAttempt = ($attempt === $maxRetries - 1);

            if (!$isLastAttempt && isRetriableNotionError($e->getCode(), $e->getMessage())) {
                $delay = $baseDelay * pow(2, $attempt) + (rand(0, 1000) / 1000);
                error_log("Notion API call failed (attempt ".($attempt+1)."/$maxRetries): ".$e->getMessage().". Retrying in {$delay}s");
                sleep($delay);
            } else {
                break;
            }
        }
    }

    throw $lastException;
}

/**
 * Determine if Notion error is retriable
 */
function isRetriableNotionError(int $httpCode, string $message): bool
{
    //
    if ($httpCode >= 500 && $httpCode < 600) return true;
    // Rate limit
    if ($httpCode === 429) return true;
    return false;
}

/**
 * Execute Notion API call
 * @param string $url
 * @return array
 * @throws Exception
 */
function executeNotionApiCall(string $url): array
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer ".NOTION_TOKEN,
        "Notion-Version: 2022-06-28",
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Failed to fetch data: ' . $error);
    }
    curl_close($ch);

    $data = json_decode($response, true);

    if ($httpCode !== 200) {
        $msg = $data['message'] ?? 'Unknown error';
        throw new Exception("Notion API error: $msg", $httpCode);
    }

    $items = [];
    foreach ($data['results'] as $page) {
        $items[] = [
            'name' => $page['properties']['Name']['rich_text'][0]['plain_text']  ?? '',
            'url' => $page['properties']['URL']['url'] ?? '',
            'description' => $page['properties']['Description']['rich_text'][0]['plain_text'] ?? '',
            'rank' => $page['properties']['Rank']['number'] ?? 0,
            'category' => $page['properties']['Category']['select']['name'] ?? ''
        ];
    }

    $grouped = [];
        foreach ($items as $item) {
            $category = $item['category'] ?? 'Uncategorized';
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][] = [
                'name' => $item['name'],
                'url' => $item['url'],
                'description' => $item['description'],
                'rank' => $item['rank']
            ];
        }

        // Sort each category by rank
        foreach ($grouped as $category => &$elements) {
            usort($elements, fn($a, $b) => ($a['rank'] ?? 0) <=> ($b['rank'] ?? 0));
        }

    return $grouped;
}

