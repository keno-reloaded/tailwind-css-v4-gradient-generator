/* Shared Plus UI newsletter UI. The service owns validation and double opt-in. */
(() => {
  if (window.__plusUiNewsletterInstalled) return;
  window.__plusUiNewsletterInstalled = true;
  const origin = 'https://server.plusuidesign.com';

  function verify(source) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const nonce = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return new Promise((resolve, reject) => {
      const previous = document.activeElement;
      const dialog = document.createElement('dialog');
      dialog.className = 'pui-verification';
      dialog.setAttribute('aria-label', 'Verify newsletter signup');
      const heading = document.createElement('h2');
      heading.textContent = 'Verify your signup';
      const frame = document.createElement('iframe');
      frame.title = 'Newsletter signup verification';
      frame.src = `${origin}/marketing/challenge?nonce=${nonce}&source=${encodeURIComponent(source)}`;
      const cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.textContent = 'Cancel';
      const cleanup = () => {
        clearTimeout(timer);
        window.removeEventListener('message', receive);
        dialog.close();
        dialog.remove();
        if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
      };
      const stop = () => { cleanup(); reject(new Error('Signup cancelled. You can try again.')); };
      const receive = event => {
        if (event.origin !== origin || event.source !== frame.contentWindow ||
            event.data?.type !== 'plus-ui-verified' || event.data?.nonce !== nonce ||
            typeof event.data?.token !== 'string' || !event.data.token) return;
        cleanup();
        resolve(event.data.token);
      };
      const timer = setTimeout(() => { cleanup(); reject(new Error('Verification timed out. Please try again.')); }, 120000);
      window.addEventListener('message', receive);
      cancel.addEventListener('click', stop);
      dialog.addEventListener('cancel', event => { event.preventDefault(); stop(); });
      dialog.append(heading, frame, cancel);
      document.body.append(dialog);
      dialog.showModal();
      cancel.focus();
    });
  }

  document.addEventListener('submit', async event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches('[data-pui-newsletter]')) return;
    event.preventDefault();
    if (!form.reportValidity() || form.dataset.busy === 'true') return;
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[role="status"]');
    const email = input.value.trim();
    const source = form.dataset.source;
    const controller = new AbortController();
    let timeout;
    form.dataset.busy = 'true';
    button.disabled = true;
    button.textContent = 'Verifying…';
    status.textContent = '';
    delete status.dataset.error;
    try {
      const challengeToken = await verify(source);
      button.textContent = 'Submitting…';
      timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(`${origin}/marketing/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, fields: { Email: email }, challengeToken }),
        signal: controller.signal,
      });
      const details = await response.json().catch(() => ({}));
      if (!response.ok || details.success !== true) {
        throw new Error(typeof details.error === 'string' ? details.error : 'Unable to subscribe. Please try again.');
      }
      input.value = '';
      status.textContent = 'Thank you. If confirmation is needed, check your inbox to confirm your subscription.';
    } catch (error) {
      status.dataset.error = 'true';
      status.textContent = error.name === 'AbortError' ? 'The request timed out. Please try again.' : error.message;
    } finally {
      clearTimeout(timeout);
      delete form.dataset.busy;
      button.disabled = false;
      button.textContent = 'Subscribe';
    }
  });
})();
