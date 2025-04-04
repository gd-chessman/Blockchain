# Sử dụng Node.js với Alpine Linux để giảm kích thước image
FROM node:20-alpine AS builder

# Đặt thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy source code và file env
COPY . .
COPY .env.local .env.local

# Build ứng dụng
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Thiết lập môi trường production
ENV NODE_ENV=production

# Copy các file cần thiết từ builder
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.local ./.env.local

# Expose port
EXPOSE 3000

# Khởi động ứng dụng
CMD ["node", ".next/standalone/server.js"] 