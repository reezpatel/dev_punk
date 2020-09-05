import { statSync, createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { FastifyPluginCallback } from 'fastify';
import mime from 'mime';

const NOT_FOUND_STATUS_CODE = 404;
const PUBLIC_DIR = join(__dirname, '..', '..', '..', 'public');

const resolvePath = (path): string => {
  const exist = existsSync(path);

  if (!exist) {
    return '';
  }

  const stat = statSync(path);

  if (stat.isDirectory()) {
    return resolvePath(join(path, 'index.html'));
  }

  if (stat.isFile()) {
    return path;
  }

  return '';
};

const publicHandler: FastifyPluginCallback<Record<string, unknown>> = (
  fastify,
  _,
  next
) => {
  // eslint-disable-next-line require-await
  fastify.get<{ Params: { '*': string } }>('/*', async (req, res) => {
    const { '*': path } = req.params;

    const absPath = resolvePath(join(PUBLIC_DIR, path || 'index.html'));

    if (absPath && absPath.startsWith(PUBLIC_DIR)) {
      const mimeType = mime.getType(absPath);

      res.header('Content-Type', mimeType).send(createReadStream(absPath));

      return;
    }

    res.status(NOT_FOUND_STATUS_CODE).send({
      message: 'File Not Found',
      success: false
    });
  });

  next();
};

export default publicHandler;
