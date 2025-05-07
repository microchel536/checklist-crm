module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx',3. '.js'], // Поддержка расширений
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Регулярное выражение для .ts и .tsx файлов
        loader: 'ts-loader', // Используйте ts-loader для обработки TypeScript
        options: {
          transpileOnly: true, // Включите трансляцию без дополнительной проверки типов
        },
        exclude: /node_modules/, // Исключите node_modules
  plugins: { // Изначальный текст
    tailwindcss: {}, // .
    autoprefixer: {}, // .
  },
};
