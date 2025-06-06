#!/bin/bash
### Example of a version-bumping script for an NPM project.
### Located at: ./bin/bump-version.sh
set -eux
OLD_VERSION="${1}"
NEW_VERSION="${2}"

# Do not tag and commit changes made by "npm version"
export npm_config_git_tag_version=false
npm version "${NEW_VERSION}"

cat << EOF > ./src/lib/version.ts
// Do Not Edit. This file is auto-generated.
/**
 * @preserve
 * Sentry Dev Toolbar Version: $NEW_VERSION
 */
const version = '$NEW_VERSION';
export default version;
EOF

cd packages/toolbar
npm version "${NEW_VERSION}"
