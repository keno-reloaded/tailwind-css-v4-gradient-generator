const FORM_ORIGIN = 'https://server.plusuidesign.com';

async function verify(source: string): Promise<string> {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return new Promise((resolve, reject) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Verify your submission');
    Object.assign(overlay.style, { position: 'fixed', inset: '0', background: 'rgba(0,0,0,.65)', zIndex: '2147483647', display: 'grid', placeItems: 'center' });
    const panel = document.createElement('div');
    Object.assign(panel.style, { width: 'min(360px,95vw)', background: 'white', borderRadius: '12px', padding: '12px' });
    const close = document.createElement('button');
    close.textContent = 'Cancel';
    close.type = 'button';
    const frame = document.createElement('iframe');
    frame.title = 'Verify your submission';
    frame.src = `${FORM_ORIGIN}/marketing/challenge?nonce=${nonce}&source=${encodeURIComponent(source)}`;
    Object.assign(frame.style, { display: 'block', border: '0', width: '100%', height: '220px' });
    const previousFocus = document.activeElement as HTMLElement | null;
    const cleanup = () => { clearTimeout(timer); window.removeEventListener('message', receive); document.removeEventListener('keydown', keydown); overlay.remove(); previousFocus?.focus(); };
    const cancel = () => { cleanup(); reject(new Error('Submission cancelled.')); };
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') cancel(); };
    const receive = (event: MessageEvent) => {
      if (event.origin !== FORM_ORIGIN || event.source !== frame.contentWindow || event.data?.type !== 'plus-ui-verified' || event.data?.nonce !== nonce || typeof event.data?.token !== 'string') return;
      cleanup(); resolve(event.data.token);
    };
    const timer = setTimeout(() => { cleanup(); reject(new Error('Verification timed out. Please try again.')); }, 120000);
    close.addEventListener('click', cancel);
    window.addEventListener('message', receive);
    document.addEventListener('keydown', keydown);
    panel.append(frame, close); overlay.append(panel);
    // Stay inside an existing feedback dialog so its focus trap does not block verification.
    const host = previousFocus?.closest('[role="dialog"]') || document.body;
    host.append(overlay); close.focus();
  });
}

export async function submitPlusUiForm(kind: 'feedback' | 'newsletter', payload: { fields: Record<string, unknown> }, source: string): Promise<Response> {
  const challengeToken = await verify(source);
  const response = await fetch(`${FORM_ORIGIN}/marketing/${kind}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, fields: payload.fields, challengeToken }),
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(typeof details.error === 'string' ? details.error : 'Unable to submit. Please try again.');
  }
  return response;
}
