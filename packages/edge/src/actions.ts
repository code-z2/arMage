import { createHash } from 'crypto';
import Jimp from 'jimp';

export const hash = (s: string) => {
  return '0x' + createHash('sha256').update(s).digest('hex');
};

export const resize = async (image: Jimp, width?: number, height?: number): Promise<Jimp> => {
  return await image.resize(width || Jimp.AUTO, height || Jimp.AUTO);
};

export const greyscale = async (image: Jimp): Promise<Jimp> => {
  return await image.greyscale();
};

export const blur = async (image: Jimp, raduis?: number): Promise<Jimp> => {
  return await image.blur(raduis || 3);
};

export const opacity = async (image: Jimp, level: number): Promise<Jimp> => {
  return await image.opacity(level);
};

export const rotate = async (image: Jimp, degree?: number): Promise<Jimp> => {
  return await image.rotate(degree || 90);
};

export const crop = async (image: Jimp, x: number, y: number, w: number, h: number): Promise<Jimp> => {
  return await image.crop(x, y, w, h);
};
