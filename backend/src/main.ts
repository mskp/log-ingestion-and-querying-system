import { App } from './app';
import { PORT } from './common/constants';

async function bootstrap(): Promise<void> {
  const app = new App(PORT);
  await app.listen();
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
