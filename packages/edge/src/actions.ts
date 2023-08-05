import Jimp from 'jimp';

export const resize = (url: string, width?: number, height?: number): Promise<any> => {
  return Jimp.read(url).then((image) => image.resize(width || Jimp.AUTO, height || Jimp.AUTO));
};
