<?php
require_once 'config.php';
require_once '../services/trakt.php';
require_once '../services/github.php';
require_once '../services/twitter.php';

$service = $_GET['service'] ?? '';

header('Content-Type: application/json');

try {
    switch ($service) {
        case 'trakt':
            echo json_encode(['movies' => fetchTraktStats()]);
            break;
        case 'github':
            $type = $_GET['type'] ?? 'user';
            $repo = $_GET['repo'] ?? GITHUB_REPO;
            echo json_encode(fetchGithubData($type, $repo));
            break;
        case 'x':
        case 'twitter':
            echo json_encode(['followers' => fetchTwitterFollowers()]);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Service not supported']);
    }
} catch (Exception $e) {
    // Handle specific HTTP codes from service errors
    $code = $e->getCode();
    if ($code >= 400 && $code < 600) {
        http_response_code($code);
    } else {
        http_response_code(500);
    }
    
    // For Twitter service, maintain backward compatibility by including followers: 0
    if (($service === 'x' || $service === 'twitter') && $code === 500) {
        echo json_encode(['error' => $e->getMessage(), 'followers' => 0]);
    } else {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
