import {
  Body,
  Controller,
  Post,
  Session,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

type LinkResponseDTO = {
  requestId: string | number;
  wallet: string;
};

@Controller('connect')
export class ConnectController {
  private readonly logger = new Logger(ConnectController.name);

  @WebSocketServer()
  server: Server;
  constructor(@Inject('ACCOUNT_LINK_SERVICE') private client: ClientProxy) {}
  /**
   * Submit a response from a ConnectQR Scan
   * and login to service
   *
   * @param session
   * @param requestId
   * @param wallet
   */
  @Post('response')
  async linkWalletResponse(
    @Session() session: Record<string, any>,
    @Body() { requestId, wallet }: LinkResponseDTO,
  ) {
    console.log(`Wallet Response ${requestId} ${wallet}`);
    // TODO: Have wallet challenge
    this.client.emit<string>('auth', { requestId, wallet });
    session.wallet = wallet;
  }
}