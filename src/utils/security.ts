import * as crypto from 'crypto-ts';
import { CryptoType } from '../types/cryptoType';

export function decrypt( key: string, text: string): CryptoType {
	return JSON.parse(crypto.AES.decrypt(text.toString(), key).toString(crypto.enc.Utf8))
}
