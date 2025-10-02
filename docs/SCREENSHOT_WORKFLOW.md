# Screenshot Workflow

## Overview

The screenshot workflow is an automated GitHub Action that captures and updates website screenshots displayed in the README. This ensures that the documentation always shows the current state of the live website at https://3dime.com.

## Features

- **Automated Scheduling**: Runs daily at 6 AM UTC
- **Manual Trigger**: Can be triggered manually via workflow dispatch
- **Multiple Devices**: Captures both desktop (1920x1080) and mobile (iPhone 13 Pro Max) screenshots
- **Automated PR Creation**: Creates pull requests with updated screenshots
- **Auto-merge**: Automatically merges PRs after creation
- **No Manual Intervention**: Fully automated workflow requiring no human interaction

## How It Works

1. **Screenshot Capture**: Uses [flameddd/screenshots-ci-action](https://github.com/flameddd/screenshots-ci-action) with Puppeteer to capture screenshots
2. **Device Simulation**: Captures desktop view (1920x1080) and iPhone 13 Pro Max view
3. **File Management**: Moves screenshots to `assets/screenshots/` directory
4. **PR Creation**: Creates a pull request with updated screenshots
5. **Auto-merge**: Automatically merges the PR using squash merge
6. **Cleanup**: Deletes the temporary branch after merge

## Configuration

### Workflow Settings

The workflow is configured in `.github/workflows/update-screenshot.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # Daily at 6:00 AM UTC
```

### Screenshot Configuration

- **Target URL**: `https://3dime.com`
- **Desktop Resolution**: 1920x1080 pixels
- **Mobile Device**: iPhone 13 Pro Max
- **Wait Condition**: `networkidle2` (waits for network to be idle)
- **Wait Selector**: `section[aria-label="contact"]` (ensures page is fully loaded)
- **Timeout**: 60000ms (60 seconds)

### Output Files

Screenshots are saved to:
- `assets/screenshots/desktopPage1920x1080.jpeg` - Desktop view
- `assets/screenshots/iPhone_13_Pro_Max.jpeg` - Mobile view

## Manual Execution

To run the screenshot workflow manually:

1. Go to the **Actions** tab in the GitHub repository
2. Select **📸 Update Screenshots** workflow
3. Click **Run workflow** dropdown
4. Select the branch (usually `main`)
5. Click **Run workflow** button

The workflow will:
- Capture fresh screenshots from the live website
- Create a new PR with the updated images
- Automatically merge the PR
- Delete the temporary branch

## Integration with README

The screenshots are displayed in the README.md:

```markdown
## 📸 Screenshots

### 🖥️ Desktop Experience
![Desktop Screenshot](assets/screenshots/desktopPage1920x1080.jpeg)

### 📱 Mobile Experience  
![Mobile Screenshot](assets/screenshots/iPhone_13_Pro_Max.jpeg)

*Screenshots are automatically updated daily via GitHub Actions*
```

## Permissions

The workflow requires:
- `contents: write` - To commit screenshot files
- `pull-requests: write` - To create and merge pull requests

## Troubleshooting

### Screenshots Not Updating

If screenshots aren't being updated:

1. **Check Workflow Runs**: Visit Actions tab and check for failed runs
2. **Verify Website Access**: Ensure https://3dime.com is accessible
3. **Check Permissions**: Verify the workflow has required permissions
4. **Review Timeout**: If site is slow, increase `waitForSelectorTimeout`

### Common Issues

**Issue**: Workflow fails with timeout error
- **Solution**: Increase `waitForSelectorTimeout` value or change `waitForSelector` to an element that loads earlier

**Issue**: Screenshots show incomplete page
- **Solution**: Adjust `waitForSelector` to wait for a later-loading element or change `waitUntil` condition

**Issue**: PR not auto-merging
- **Solution**: Check that branch protection rules allow admin force merge and that GITHUB_TOKEN has sufficient permissions

## Maintenance

### Regular Tasks
- Monitor workflow execution for failures
- Verify screenshots accurately represent the current site
- Update device selection if new popular devices emerge
- Adjust timeout values if site performance changes

### Workflow Updates

The workflow file is located at: `.github/workflows/update-screenshot.yml`

To modify behavior:
- **Change schedule**: Modify the cron expression
- **Add devices**: Update the `devices` parameter with additional device names
- **Change resolution**: Desktop resolution is determined by the action's default
- **Update URL**: Change the `url` parameter if the site moves to a new domain

## Performance

- **Execution Time**: Typically 2-4 minutes depending on site loading time
- **Storage Impact**: ~500KB for both screenshots combined
- **PR History**: Each update creates one commit via squash merge
- **Network Usage**: Minimal - only downloads the target website

## Best Practices

1. **Keep Screenshots Fresh**: Daily updates ensure documentation stays current
2. **Monitor File Sizes**: Screenshots should remain under 500KB for optimal GitHub performance
3. **Test After Major Changes**: Trigger manually after significant UI updates
4. **Review PRs Occasionally**: Check auto-merged PRs to ensure quality

---

**Note**: This workflow helps maintain up-to-date visual documentation, improving the user experience for those discovering the project and ensuring the README accurately represents the current state of the website.
