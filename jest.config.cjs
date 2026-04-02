module.exports = {
  cache: false,
  cacheDirectory: "<rootDir>/.tmp/jest/cache",
  passWithNoTests: true,
  coverageReporters: ['text']
};

// Override os.tmpdir so that Jest HasteMap writes temp files under .tmp
// and avoid writing into system /tmp (which may be restricted).
{
  const os = require("os");
  const path = require("path");


  os.tmpdir = () => path.join(__dirname, ".tmp", "jest", "tmp");
}
