import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Request, Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { UserEntity } from '../users/user.entity';
import { McpAuthGuard } from './mcp-auth.guard';
import { McpServerFactory } from './mcp-server.factory';

@Public()
@UseGuards(McpAuthGuard)
@Controller('mcp')
export class McpController {
  constructor(private readonly mcpServerFactory: McpServerFactory) {}

  @Post()
  async handle(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as UserEntity;
    const server = this.mcpServerFactory.create(user.id);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on('close', () => {
      void transport.close();
      void server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }

  @Get()
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  rejectStream(): void {}

  @Delete()
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  rejectSessionEnd(): void {}
}
