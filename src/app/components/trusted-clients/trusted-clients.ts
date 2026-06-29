import { Component } from '@angular/core';

@Component({
  selector: 'app-trusted-clients',
  standalone: true,
  templateUrl: './trusted-clients.html',
})
export class TrustedClients {
  private readonly clients = [
    'NorthBank',
    'Lumen Cloud',
    'Vertex Health',
    'Aurora Labs',
    'FinEdge',
    'Quantel',
    'Skyline',
    'Meridian',
    'Cobalt',
    'Stratus',
  ];

  protected readonly marquee = [...this.clients, ...this.clients];
}
