exports.handler = async (event) => {
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

  try {
    const dados = JSON.parse(event.body || '{}');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sucesso: true,
        mensagem: 'Dados recebidos com sucesso!',
        dadosRecebidos: dados
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ erro: 'Erro ao processar', detalhe: error.message })
    };
  }
};
