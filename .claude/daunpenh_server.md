Login Credentials:
VPS Name: n1099-startup-plan-271
IP Address: 157.10.73.82
Username: ubuntu
Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)! 


Server user name and password:
ssh ubuntu@157.10.73.82
FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!


SOURCE:
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=5&pool_timeout=10"

DESTINATION:
# Prisma-specific URL (with aggressive connection pooling for serverless production)
POSTGRES_PRISMA_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=5&pool_timeout=10"
