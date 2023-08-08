import { createHash } from 'crypto';
import Jimp from 'jimp';

export const hash = (s: string) => {
  return '0x' + createHash('sha256').update(s).digest('hex');
};

export const resize = (url, width?: number, height?: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.resize(width || Jimp.AUTO, height || Jimp.AUTO));
};

export const greyscale = (url): Promise<any> => {
  return Jimp.read(url).then((image) => image.greyscale());
};

export const blur = (url, raduis?: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.blur(raduis || 3));
};

export const opacity = (url, level: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.opacity(level));
};

export const rotate = (url, degree?: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.rotate(degree || 90));
};

export const crop = (url, x: number, y: number, w: number, h: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.crop(x, y, w, h));
};
