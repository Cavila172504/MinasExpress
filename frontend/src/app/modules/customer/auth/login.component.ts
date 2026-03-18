import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="relative flex min-h-[100dvh] w-full flex-col items-center justify-between bg-primary-blue p-6 font-display antialiased">
      <!-- Top Spacer -->
      <div class="h-10"></div>
      
      <!-- Main Content Area -->
      <div class="flex flex-col items-center justify-center w-full max-w-md animate-fade-in-up">
        <!-- Logo Card Container -->
        <div class="bg-white p-8 rounded-xl shadow-2xl mb-8 flex items-center justify-center aspect-square w-48 h-48 animate-pulse-slow">
          <img alt="MinasExpress Logo" class="w-full h-full object-contain" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1_DjLeWOEh5ZKpSS06NKDHN5tHU4SKxsL85l6aoYL_sJqzJmFQ-6FVH8ygmWXXlbwXATSZf2F8bN7i4hrXRM0g1PV2Y7F017x8_J_Dkl2jlyVR4u0DqS2neasROqgfvNHguJSTMq81C2-5vaHrqgUAfETe8czliSxiZSeMbiOlnqSAjMP9hJ7zYiPJB46cHfUm67ujXksQTj6mXj6QjlIM-x3vQ2fIHdOHYxxncXZy6Ajdbx_BbJjjQuNshOPOr0LJkrByKLbv5zZ"/>
        </div>
        
        <!-- Branding Text -->
        <div class="text-center space-y-3">
          <h1 class="text-white text-4xl font-extrabold tracking-tight">
              MinasExpress
          </h1>
          <p class="text-white/90 text-lg font-medium leading-relaxed max-w-[280px] mx-auto">
              Lo mejor de nuestro pueblo, a tu puerta
          </p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="w-full max-w-[480px] flex flex-col gap-4 pb-10">
        <!-- Primary Action Button -->
        <button (click)="login()" 
                class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-accent-red text-white text-lg font-bold leading-normal tracking-wide shadow-lg active:scale-[0.98] transition-transform">
          <span class="truncate">Comenzar ahora</span>
        </button>
        
        <!-- Secondary Action Button -->
        <button (click)="login()" 
                class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 border-2 border-white bg-transparent text-white text-lg font-bold leading-normal tracking-wide active:bg-white/10 transition-colors">
          <span class="truncate">Ya tengo cuenta</span>
        </button>
      </div>
      
      <!-- Footer Link -->
      <div class="pb-4">
        <button class="flex items-center gap-1 text-white/70 text-sm font-medium">
          <span class="material-symbols-outlined text-sm">language</span>
          Español (Latinoamérica)
        </button>
      </div>
    </div>
  `,
    styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 600ms ease-out both;
    }
    @keyframes pulseSlow {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    .animate-pulse-slow {
      animation: pulseSlow 3s ease-in-out infinite;
    }
    `]
})
export class LoginComponent {
    constructor(private router: Router, private auth: AuthService) { }

    login() {
        this.auth.login();
        this.router.navigate(['/home']);
    }
}

