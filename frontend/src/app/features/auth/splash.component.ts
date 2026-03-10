import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-splash',
    standalone: true,
    template: `
    <div class="splash-screen">
      <div class="splash-bg">
        <div class="mountain mountain-1"></div>
        <div class="mountain mountain-2"></div>
        <div class="mountain mountain-3"></div>
      </div>
      <div class="splash-content">
        <div class="logo-container">
          <div class="logo-circle">
            <span class="logo-icon">🏔️</span>
          </div>
          <h1 class="app-title">Minas<span>Express</span></h1>
          <p class="app-subtitle">Encargos y delivery en tu pueblo</p>
        </div>
        <div class="loading-bar">
          <div class="loading-progress"></div>
        </div>
      </div>
      <p class="splash-footer">San José de Minas 🇪🇨</p>
    </div>
  `,
    styles: [`
    .splash-screen {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(165deg, #1a3a0a 0%, #2d5016 35%, #4a7c28 70%, #6ba33d 100%);
      z-index: 1000;
      overflow: hidden;
    }

    .splash-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .mountain {
      position: absolute;
      bottom: 0;
      width: 100%;
      opacity: 0.15;
    }

    .mountain-1 {
      height: 40%;
      background: linear-gradient(135deg, transparent 33%, #fff 33%, #fff 34%, transparent 34%,
                                  transparent 66%, #fff 66%, #fff 67%, transparent 67%);
      animation: mountainFloat 8s ease-in-out infinite;
    }

    .mountain-2 {
      height: 30%;
      left: -20%;
      width: 140%;
      background: linear-gradient(145deg, transparent 40%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.5) 41%, transparent 41%);
      animation: mountainFloat 10s ease-in-out infinite reverse;
    }

    .mountain-3 {
      height: 20%;
      background: rgba(255,255,255,0.1);
      border-radius: 50% 50% 0 0;
      transform: scaleX(2);
    }

    @keyframes mountainFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .splash-content {
      position: relative;
      z-index: 1;
      text-align: center;
      animation: fadeInScale 800ms ease-out;
    }

    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(20px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid rgba(255,255,255,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-icon {
      font-size: 56px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      letter-spacing: -1px;
      text-shadow: 0 2px 16px rgba(0,0,0,0.3);
    }

    .app-title span {
      color: #fbbf24;
    }

    .app-subtitle {
      font-size: 1rem;
      color: rgba(255,255,255,0.8);
      font-weight: 400;
      letter-spacing: 0.5px;
    }

    .loading-bar {
      margin-top: 48px;
      width: 200px;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
      overflow: hidden;
      margin-left: auto;
      margin-right: auto;
    }

    .loading-progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #fbbf24, #f59e0b);
      border-radius: 4px;
      animation: loadProgress 2s ease-out forwards;
    }

    @keyframes loadProgress {
      to { width: 100%; }
    }

    .splash-footer {
      position: absolute;
      bottom: 40px;
      color: rgba(255,255,255,0.5);
      font-size: 0.8rem;
      letter-spacing: 1px;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
      50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
    }
  `],
})
export class SplashComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['/home']);
        }, 2500);
    }
}
