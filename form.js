// 문의 폼: /api/inquiry 로 보내고, 결과를 쉬운 말로 보여 준다
(function () {
  const form = document.getElementById('inquiry');
  if (!form) return;
  const msg = form.querySelector('.form-msg');
  const btn = form.querySelector('button[type=submit]');

  // 상품 페이지에서 넘어오면 관심 상품을 미리 골라 둔다 (예: index.html?p=정수기#contact)
  const pick = new URLSearchParams(location.search).get('p');
  if (pick) {
    const opt = [...form.interest.options].find((o) => o.value === pick);
    if (opt) form.interest.value = pick;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';
    if (!form.name.value.trim() || !form.contact.value.trim()) {
      msg.className = 'form-msg err';
      msg.textContent = '이름과 연락처를 적어 주세요.';
      return;
    }
    if (!form.consent.checked) {
      msg.className = 'form-msg err';
      msg.textContent = '개인정보 수집·이용에 동의해 주세요.';
      return;
    }
    btn.disabled = true;
    btn.textContent = '보내는 중…';
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.value,
          contact: form.contact.value,
          message: form.interest.value,
          consent: form.consent.checked,
          website: form.website.value,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.');
      form.reset();
      msg.className = 'form-msg ok';
      msg.textContent = '문의가 접수됐어요. 확인 후 연락드릴게요.';
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = err.message || '보내지 못했어요. 잠시 뒤 다시 시도해 주세요.';
    } finally {
      btn.disabled = false;
      btn.textContent = '전화로 설명 듣기';
    }
  });
})();
