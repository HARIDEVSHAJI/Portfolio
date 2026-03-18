import psycopg2
import traceback
import sys

try:
    print('Connecting...')
    psycopg2.connect('dbname=portfolio_db user=postgres password=portfolio123 host=127.0.0.1 port=5432')
    print('Success')
except Exception as e:
    with open('error.txt', 'w', encoding='utf-8') as f:
        f.write(traceback.format_exc())
    sys.exit(1)
