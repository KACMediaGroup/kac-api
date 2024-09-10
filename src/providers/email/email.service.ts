import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('email.service'),
      host: this.configService.get<string>('email.host'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.password'),
      },
    })
  }

  // 비밀번호 재설정 이메일 발송 함수
  async sendEmailToResetPassword(to: string, resetPassword: string, name: string): Promise<void> {
    console.log(`name: ${name}`)
    const template = {
      subject: 'Password Reset Request',
      html: 'reset-password.html',
    }

    const templatePath = path.join(__dirname, 'templates', template.html)
    console.log(`templatePath: ${templatePath}`)

    try {
      // HTML 템플릿 파일 읽기
      const html = await fs.readFile(templatePath, 'utf8')

      const resetPasswordUrl = `${this.configService.get('kacFe.appHost')}/reset-password/${resetPassword}`

      // HTML 템플릿에 필요한 값 치환
      const replacedHtml = this.replaceTemplatePlaceholders(html, {
        resetPasswordUrl,
        name,
      })

      // 이메일 발송
      const emailOptions = {
        from: 'no-reply@k-artistclass.com',
        to,
        subject: template.subject,
        html: replacedHtml,
      }

      await this.transporter.sendMail(emailOptions)
    } catch (error) {
      console.error('Error reading the template or sending email:', error)
      throw new Error('Failed to send password reset email')
    }
  }

  // 템플릿 치환 함수
  private replaceTemplatePlaceholders(
    html: string,
    replacements: { [key: string]: string },
  ): string {
    let result = html
    for (const key in replacements) {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), replacements[key])
    }
    return result
  }
}
