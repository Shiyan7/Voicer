import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import type { Request, Response } from 'express';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { UserEntity as UserEntityModel } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() dto: SignUpInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.signUp(dto);
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    // Tokens are also returned in the body for clients where third-party
    // cookies don't survive (the packaged Tauri webview); the web client
    // relies on the httpOnly cookies and ignores them.
    return { ok: true, ...tokens };
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() { email, password }: SignInInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.signIn(email, password);
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { ok: true, ...tokens };
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Body() body: { refreshToken?: string } | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Cookie for the web client, request body for the Tauri client.
    const token =
      (req.cookies?.refreshToken as string | undefined) ?? body?.refreshToken;
    if (!token) {
      this.clearRefreshCookie(res);
      throw new UnauthorizedException();
    }

    const tokens = this.auth.refreshToken(token);
    this.setAccessCookie(res, tokens.accessToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { ok: true, ...tokens };
  }

  /**
   * Short-lived access token for clients that cannot use the httpOnly
   * cookies — e.g. the desktop (Rust) audio uploader, which sends it as
   * an `Authorization: Bearer` header.
   */
  @Get('/token')
  @UseGuards(JwtAuthGuard)
  getToken(@UserEntity() user: UserEntityModel) {
    const { accessToken } = this.auth.generateTokens({ userId: user.id });
    return { accessToken };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAccessCookie(res);
    this.clearRefreshCookie(res);
    return { ok: true };
  }

  private setAccessCookie(res: Response, accessToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  private clearAccessCookie(res: Response) {
    res.clearCookie('accessToken');
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
