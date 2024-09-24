export const signUpMailHtml = (logoLink: string, verificationLink: string) => `<!doctype html>
<html lang="en">
  <head>
    <style>
      body {
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
      }

      h1 {
        color: #333333;
        text-align: center;
      }

      .container {
        width: 500px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
      }
      .header img {
        width: 200px;
      }
      .content {
        padding: 20px;
      }
      .content h1 {
        color: #333333;
      }
      .content p {
        color: #666666;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        padding: 20px 0;
        color: #999999;
        font-size: 12px;
      }
      .sign-up-button {        
        display: inline-block;
        padding: 10px 180px;
        color: #ffffff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="${logoLink}" alt="Logo" />
      </div>
      <div class="content">
        <h1>회원가입 인증 메일</h1>
        <br />
        <br />
        <p>안녕하세요,</p>
        <br />
        <p>
          클릭 앱에 가입해 주셔서 감사합니다.<br />
          아래 버튼을 클릭하여 회원가입을 완료해 주세요.
        </p>
        <br />
        <p style="text-align: center">
          <a
            class="sign-up-button"
            href="${verificationLink}"           
            >회원가입 완료</a
          >
        </p>
        <br />
        <p>감사합니다!</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 클릭소프트주식회사. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
