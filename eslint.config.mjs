// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig(
    eslint.configs.recommended,
    // TS 추천 (타입 기반 버그 방지)
    tseslint.configs.strictTypeChecked,
    // TS 스타일 추천 (일관된 코드 스타일)
    tseslint.configs.stylisticTypeChecked,
    prettierConfig
);
