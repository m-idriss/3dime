<?php
// Check if config.php exists
if (!file_exists('config.php')) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'error' => 'Configuration file missing. Please copy config.php.example to config.php and configure GitHub credentials.'
    ]);
    exit;
}

require_once 'config.php';
require_once 'services/github.php';
require_once 'services/notion.php';

$service = $_GET['service'] ?? '';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    switch ($service) {
        case 'github':
            $type = $_GET['type'] ?? 'user';
            $repo = $_GET['repo'] ?? GITHUB_REPO;
            if ($type === 'commits_all') {
                echo json_encode(getAllCommitActivityAsJson());
            } else {
                echo json_encode(fetchGithubData($type, $repo));
            }
            break;

        case 'notion':
            $db = $_GET['db'] ?? '';
            if (empty($db)) {
                http_response_code(400);
                echo json_encode(['error' => 'Database ID is required for Notion service']);
                exit;
            }

            if ($db === 'all') {
                $all = [];
                foreach (DATABASES as $key => $id) {
                    try {
                        $all[$key] = fetchNotionData($key);
                    } catch (Exception $e) {
                        error_log("Error fetching $key: ".$e->getMessage());
                        $all[$key] = [];
                    }
                }
                echo json_encode($all);
            } else {
                echo json_encode(fetchNotionData($db));
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Service not supported']);
    }
} catch (Exception $e) {
    $code = $e->getCode();
    if ($code >= 400 && $code < 600) {
        http_response_code($code);
    } else {
        http_response_code(500);
    }
    
    echo json_encode(['error' => $e->getMessage()]);
}
