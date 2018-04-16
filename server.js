const { format, parse } = require('url');
const { createServer } = require('http');
const invariant = require('assert').strict.ok;

const REDIRECT_URL = format(process.env.REDIRECT_URL);
const STATUS = parseInt(process.env.STATUS, 10) || 301;
const PORT = parseInt(process.env.PORT, 10) || 80;

invariant(REDIRECT_URL, 'REDIRECT_URL environment variable is missing');
invariant(REDIRECT_URL.search(/[\?=]/) === -1, 'REDIRECT_URL cannot contain any querystring or fragments');

const isHealthCheck = headers => {
  return !!(
    headers['x-forwarded-for'] ||
    headers['x-forwarded-proto'] ||
    headers['x-requested-by'] ||
    (headers['user-agent'] && headers['user-agent'].search(/(GoogleHC|kube-probe)/) > -1)
  );
};

createServer((req, res) => {
  const url = parse(req.url);
  const Location = `${REDIRECT_URL}${url.search || ''}`;
  const skip = isHealthCheck(req.headers);

  if (skip) {
    console.log('Skipping redirection', req.headers);

    res.statusCode = 200;
    res.end();
  } else {
    console.log(`Redirecting ==> ${req.url} to ${Location}`, req.headers);

    res.writeHead(STATUS, { Location });
    res.end();
  }

}).listen(PORT);

console.log(`Serving on ${PORT} redirecting to ${REDIRECT_URL} with ${STATUS}`);
