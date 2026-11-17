(() => {
  'use strict';

  // Este é o mesmo número configurado atualmente no botão principal do site.
  const CONTACT_WHATSAPP = '5511921211397';
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const year = document.getElementById('contact-year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const business = String(data.get('business') || '').trim();
    const service = String(data.get('service') || '').trim();
    const details = String(data.get('details') || '').trim();

    const message = [
      'Olá! Vim pelo site da G&I Agência e gostaria de conversar sobre um projeto.',
      '',
      'Nome: ' + name,
      business ? 'Empresa: ' + business : '',
      'Serviço: ' + service,
      'Sobre o projeto: ' + details
    ].filter(Boolean).join('\n');

    const whatsappUrl = 'https://wa.me/' + CONTACT_WHATSAPP + '?text=' + encodeURIComponent(message);

    // Evento preparado para ser conectado ao Google Tag Manager/Google Ads.
    // Ainda não conta como conversão até que a tag correspondente seja configurada.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_lead_submit',
      lead_method: 'whatsapp',
      lead_service: service
    });

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (feedback) feedback.textContent = 'Sua mensagem está pronta no WhatsApp. É só revisar e enviar por lá.';
  });
})();