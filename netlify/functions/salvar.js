exports.handler = async (event, context) => {
  // Importa a biblioteca diretamente no momento da execução
  const { Client } = await import('https://esm.sh/pg@8.11.3');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const dados = JSON.parse(event.body);

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS anotacoes (
        id SERIAL PRIMARY KEY,
        hidrometro VARCHAR(100),
        leitura VARCHAR(100),
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const queryText = 'INSERT INTO anotacoes(hidrometro, leitura) VALUES($1, $2) RETURNING *';
    const values = [dados.hidrometro, dados.leitura];
    const res = await client.query(queryText, values);

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sucesso: true,
        mensagem: 'Anotação salva com sucesso no banco!',
        registro: res.rows[0]
      })
    };
  } catch (error) {
    if (client) await client.end();
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ erro: 'Erro ao salvar no banco', detalhe: error.message })
    };
  }
};