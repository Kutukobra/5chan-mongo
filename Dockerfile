# Gunakan image Node.js versi 22 (sesuai dengan kamu)
FROM node:22

# Set working directory
WORKDIR /app

# Salin file package.json dan lock file terlebih dahulu (lebih efisien untuk cache layer install)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Salin semua file ke dalam container
COPY . .

# Set environment variable (opsional)
ENV PORT=3000

# Buka port untuk container
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
