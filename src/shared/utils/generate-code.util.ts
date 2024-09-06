export class GenerateCodeUtil {
  static generateCode(digits: number): string {
    return String(Math.floor(Math.random() * 10 ** digits)).padStart(digits, '0');
  }
}
