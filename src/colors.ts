const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
}

export const red = (str) => {
  return colors.red + colors.bright + str + colors.reset;
}

export const yellow = (str) => {
  return colors.yellow + colors.bright + str + colors.reset;
}

export const cyan = (str) => {
  return colors.cyan + colors.bright + str + colors.reset;
}
