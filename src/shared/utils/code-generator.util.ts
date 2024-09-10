import * as crypto from 'crypto'

export class CodeGeneratorUtil {
  static generateCode(digits: number): string {
    return String(Math.floor(Math.random() * 10 ** digits)).padStart(digits, '0')
  }

  static generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex')
  }
}
