<?php
// Twitter/X API service

function fetchTwitterFollowers() {
    // Check if X_USERNAME is configured
    if (!defined('X_USERNAME') || !X_USERNAME) {
        throw new Exception('X_USERNAME not configured', 500);
    }

    // Check if bearer token is configured
    if (!defined('X_BEARER_TOKEN') || !X_BEARER_TOKEN || X_BEARER_TOKEN === 'your_twitter_bearer_token_here') {
        throw new Exception('X_BEARER_TOKEN not configured', 500);
    }

    $username = X_USERNAME;
    
    // First get user ID from username using Twitter API v2
    $userUrl = "https://api.twitter.com/2/users/by/username/$username";
    $ch = curl_init($userUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . X_BEARER_TOKEN,
        "User-Agent: 3dime-proxy-script"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $userResponse = curl_exec($ch);
    
    if ($userResponse === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Failed to fetch user data: ' . $error);
    }
    curl_close($ch);

    $userData = json_decode($userResponse, true);
    if ($userData === null || !isset($userData['data']['id'])) {
        throw new Exception('Invalid user response or user not found');
    }

    $userId = $userData['data']['id'];
    
    // Now get user details including follower count
    $userDetailUrl = "https://api.twitter.com/2/users/$userId?user.fields=public_metrics";
    $ch = curl_init($userDetailUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . X_BEARER_TOKEN,
        "User-Agent: 3dime-proxy-script"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $detailResponse = curl_exec($ch);
    
    if ($detailResponse === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Failed to fetch follower data: ' . $error);
    }
    curl_close($ch);

    $detailData = json_decode($detailResponse, true);
    if ($detailData === null) {
        throw new Exception('Invalid follower response');
    }
    
    $followersCount = $detailData['data']['public_metrics']['followers_count'] ?? 0;
    return $followersCount;
}
?>