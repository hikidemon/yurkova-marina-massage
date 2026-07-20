export function formatDescription(text: string): string {
  let result = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  result = result
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/^### (.+)$/gm, '<h4 class="fmt-subheading">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="fmt-subheading">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="fmt-subheading">$1</h2>')
    .replace(/^[-+]\s+(.+)$/gm, '<span class="fmt-subitem">$1</span>')

  result = result
    .split(/\n\n+/)
    .map(block => `<p>${block
      .replace(/\n/g, '<br/>')
      .replace(/<br\/?>\s*(?=<span class="fmt-subitem")/g, '')
      .replace(/(?<=<\/span>)\s*<br\/?>/g, '')
    }</p>`)
    .join('')

  return result
}
