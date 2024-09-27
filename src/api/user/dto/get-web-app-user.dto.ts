export class GetWebAppUserRequest {
  // 요청에 필요한 필드 정의
  hsUserId: string;
}

export class GetWebAppUserResponse {
  // 응답에 필요한 필드 정의
  id: number;
  name: string;
  email: string;
}