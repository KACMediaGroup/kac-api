export class KakaoUserResponseDto {
  id: number // Kakao user ID
  connected_at: string // Timestamp of when the user connected

  properties: {
    nickname: string
    profile_image: string
    thumbnail_image: string
  }

  kakao_account: {
    profile_nickname_needs_agreement: boolean
    profile_image_needs_agreement: boolean
    profile: {
      nickname: string
      thumbnail_image_url: string
      profile_image_url: string
      is_default_image: boolean
      is_default_nickname: boolean
    }
    has_email: boolean
    email_needs_agreement: boolean
    is_email_valid: boolean
    is_email_verified: boolean
    email: string
    has_age_range: boolean
    age_range_needs_agreement: boolean
    age_range: string
    has_birthday: boolean
    birthday_needs_agreement: boolean
    birthday: string
    birthday_type: 'SOLAR' | 'LUNAR' // assuming only SOLAR and LUNAR types
    has_gender: boolean
    gender_needs_agreement: boolean
    // Add other fields as necessary
  }
}
