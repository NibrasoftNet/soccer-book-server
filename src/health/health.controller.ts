import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: HttpHealthIndicator,
    private database: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () => await this.dns.pingCheck('google', 'https://www.google.com'),
      async () => await this.database.pingCheck('postgres', {}),
      async () => await this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      async () => await this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      async () =>
        await this.disk.checkStorage('disk health', {
          thresholdPercent: 0.5,
          path: '/',
        }),
    ]);
  }
}
