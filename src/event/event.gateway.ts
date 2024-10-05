import { WebSocketGateway, OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from "socket.io"
import { AuthService } from './../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

  @WebSocketServer()

  server: Server;
  jwtService: any;
  constructor( private readonly authService: AuthService) { }

  afterInit(socket: Socket) {
  }

  handleConnection( socket: Socket) {
    console.log("first")
    const authHeader = socket.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token);
        socket.data.codeId = payload.codeId;
        socket.join(socket.data.codeId)
        
      } catch (error) {
        console.log('Token validation failed:', error);
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }

  }

  handleDisconnect(socket: Socket) {
    console.log("first", socket.data.codeId)
  }
  handleEmitSocket({data, event, to}) {
    if(to) {
      this.server.to(to).emit(event, data)
    }else {
      this.server.emit(event, data)
    }
  }

  
  @SubscribeMessage('mesage')
  findAll(@ConnectedSocket() socket:Socket ,@MessageBody() data: any) {
    console.log("message", data)
   
  }

}
