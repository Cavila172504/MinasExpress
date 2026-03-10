import { Component, inject, signal, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService, AuthService } from '../../core/services/data.service';
import { Mensaje } from '../../core/models/interfaces';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="chat-page">
      <!-- Header -->
      <header class="chat-header">
        <button class="back-btn" (click)="volver()">←</button>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
             alt="Motorizado" class="chat-avatar" />
        <div class="chat-user-info">
          <h3>Carlos López</h3>
          <p>Motorizado · En línea</p>
        </div>
        <a href="tel:0987654321" class="call-btn">📞</a>
      </header>

      <!-- Messages -->
      <div class="messages-container" #messagesContainer>
        <div class="messages-date">Hoy</div>
        @for (msg of mensajes(); track msg.id) {
          <div class="message" [class.sent]="msg.emisorId === userId" [class.received]="msg.emisorId !== userId">
            <div class="msg-bubble">
              <p class="msg-text">{{ msg.texto }}</p>
              <span class="msg-time">{{ msg.enviadoEn | date:'HH:mm' }}</span>
            </div>
          </div>
        }
      </div>

      <!-- Input -->
      <div class="chat-input-bar">
        <input
          type="text"
          class="chat-input"
          placeholder="Escribe un mensaje..."
          [(ngModel)]="nuevoMensaje"
          (keyup.enter)="enviar()"
        />
        <button class="send-btn" (click)="enviar()" [disabled]="!nuevoMensaje.trim()">
          <span>➤</span>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .chat-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
      background: #e8efe0;
    }

    /* Header */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-primary-gradient);
      color: white;
      box-shadow: var(--shadow-md);
    }
    .back-btn {
      width: 36px; height: 36px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      font-size: 1.1rem; font-weight: 700;
      color: white;
      display: flex; align-items: center; justify-content: center;
    }
    .chat-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255,255,255,0.3);
    }
    .chat-user-info { flex: 1; }
    .chat-user-info h3 { font-size: 0.95rem; font-weight: 700; }
    .chat-user-info p { font-size: 0.7rem; opacity: 0.8; }
    .call-btn {
      width: 40px; height: 40px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
      text-decoration: none;
    }

    /* Messages */
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .messages-date {
      text-align: center;
      font-size: 0.7rem;
      color: var(--color-text-light);
      background: rgba(255,255,255,0.7);
      padding: 4px 14px;
      border-radius: 20px;
      align-self: center;
      margin-bottom: 8px;
    }

    .message {
      display: flex;
      max-width: 85%;
      animation: fadeIn 200ms ease;
    }
    .message.sent { align-self: flex-end; }
    .message.received { align-self: flex-start; }

    .msg-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      position: relative;
      min-width: 80px;
    }
    .sent .msg-bubble {
      background: var(--color-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .received .msg-bubble {
      background: white;
      color: var(--color-text);
      border-bottom-left-radius: 4px;
      box-shadow: var(--shadow-xs);
    }
    .msg-text { font-size: 0.88rem; line-height: 1.4; margin-bottom: 4px; word-break: break-word; }
    .msg-time {
      font-size: 0.62rem;
      opacity: 0.6;
      display: block;
      text-align: right;
    }

    /* Input Bar */
    .chat-input-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px calc(10px + env(safe-area-inset-bottom, 0px));
      background: white;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    }
    .chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid var(--color-border);
      border-radius: 24px;
      font-size: 0.88rem;
      outline: none;
      background: var(--color-bg-light);
      transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: var(--color-primary-light); }
    .send-btn {
      width: 44px; height: 44px;
      background: var(--color-primary-gradient);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white;
      font-size: 1.2rem;
      box-shadow: var(--shadow-glow);
      transition: transform 0.2s;
    }
    .send-btn:active { transform: scale(0.9); }
    .send-btn:disabled { opacity: 0.5; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class ChatComponent implements OnInit, AfterViewChecked {
    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private chatService = inject(ChatService);
    private auth = inject(AuthService);

    mensajes = signal<Mensaje[]>([]);
    nuevoMensaje = '';
    pedidoId = '';
    userId = '';

    ngOnInit() {
        this.userId = this.auth.usuario()?.uid || 'user-1';
        this.route.params.subscribe(params => {
            this.pedidoId = params['id'];
            this.mensajes.set(this.chatService.getMensajesByPedido(this.pedidoId));
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    enviar() {
        if (!this.nuevoMensaje.trim()) return;
        this.chatService.enviarMensaje(this.pedidoId, this.userId, this.nuevoMensaje.trim());
        this.mensajes.set(this.chatService.getMensajesByPedido(this.pedidoId));
        this.nuevoMensaje = '';

        // Simulate motorizado response
        setTimeout(() => {
            this.chatService.enviarMensaje(this.pedidoId, 'user-moto-1', '¡Entendido! 👍');
            this.mensajes.set(this.chatService.getMensajesByPedido(this.pedidoId));
        }, 1500);
    }

    private scrollToBottom() {
        try {
            this.messagesContainer.nativeElement.scrollTop =
                this.messagesContainer.nativeElement.scrollHeight;
        } catch (e) { }
    }

    volver() { this.router.navigate(['/seguimiento', this.pedidoId]); }
}
