const fs = require('fs')
const path = require('path')

// Source and destination directories
const srcDir = path.join(__dirname, 'src', 'keys')
const destDir = path.join(__dirname, 'build', 'src/keys')

// Function to copy files
function copyFiles () {
  // Ensure source directory exists
  if (!fs.existsSync(srcDir)) {
    console.error('Source directory does not exist:', srcDir)
    return
  }

  // Ensure destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  // Copy files
  fs.readdir(srcDir, (err, files) => {
    if (err) {
      console.error('Error reading source directory:', err)
      return
    }

    files.forEach(file => {
      const srcFile = path.join(srcDir, file)
      const destFile = path.join(destDir, file)

      // Copy file
      fs.copyFile(srcFile, destFile, err => {
        if (err) {
          console.error('Error copying file:', err)
          return
        }
        console.log(`Copied ${srcFile} to ${destFile}`)
      })
    })
  })
}

// Invoke copyFiles function
copyFiles()
