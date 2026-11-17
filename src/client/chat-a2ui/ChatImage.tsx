/**
 * 附件图片：按原始宽高比占位、懒加载、失败降级、点击开灯箱。
 *
 * loadImage 由宿主注入，可能抛错（附件已过期、权限不足等），
 * 这里一律捕获并降级成紧凑的失败态，绝不把异常抛给渲染树。
 * 灯箱 portal 到 document.body：聊天滚动容器会裁剪 fixed/absolute 元素，
 * 挂在原地会让遮罩只盖住消息流，而不是整个窗口。
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cls } from './classes'
import { cx, formatBytes } from './util'
import { reducedMotion, spring } from './motion'
import type { ImageAttachmentRef } from './types'

export interface ChatImageProps {
  attachment: ImageAttachmentRef
  loadImage: (attachment: ImageAttachmentRef) => string | Promise<string>
  alt?: string
}

function toDimension (value: number): number | undefined {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : undefined
}

export function ChatImage ({ attachment, loadImage, alt }: ChatImageProps) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [src, setSrc] = useState<string | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  // 宿主原生 imageUrl 返回 Promise（要先向附件服务换地址），测试替身也可以同步返回。
  // 两条路径都收敛到 src/failed，绝不让 Promise 本身进入 img.src。
  useEffect(() => {
    let alive = true
    setSrc(null)
    setFailed(false)
    setLoading(true)
    setOpen(false)
    const settle = (value: string | null): void => {
      if (!alive) return
      if (value === null || value === '') {
        setFailed(true)
      } else {
        setSrc(value)
      }
      setLoading(false)
    }
    let result: string | Promise<string>
    try {
      result = loadImage(attachment)
    } catch {
      settle(null)
      return () => { alive = false }
    }
    if (typeof result === 'string') {
      settle(result)
      return () => { alive = false }
    }
    Promise.resolve(result).then(settle, () => { settle(null) })
    return () => { alive = false }
    // 快照可能重建 attachment 对象，但 attachmentId 稳定；按 id 取图，避免每次流式重渲染都重换 blob。
  }, [attachment.attachmentId, attachment.width, attachment.height, loadImage])

  const fallbackLabel = attachment.name !== undefined && attachment.name !== '' ? attachment.name : '图片'
  const label = alt !== undefined && alt.trim() !== '' ? alt : fallbackLabel

  const captionParts: string[] = []
  if (attachment.name !== undefined && attachment.name !== '') captionParts.push(attachment.name)
  const sizeText = formatBytes(attachment.bytes)
  if (sizeText !== '') captionParts.push(sizeText)
  const caption = captionParts.join(' · ')

  const close = useCallback(() => setOpen(false), [])

  // 图片加载失败时不要留着一个空灯箱。
  useEffect(() => {
    if (failed) setOpen(false)
  }, [failed])

  // 灯箱打开期间：锁定滚动、聚焦关闭按钮、Esc 关闭、关闭后焦点还原。
  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    const doc = document
    const body = doc.body
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
    }
    doc.addEventListener('keydown', onKeyDown, true)
    return () => {
      doc.removeEventListener('keydown', onKeyDown, true)
      body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [open])

  if (loading && src === null) {
    return (
      <figure
        className={cx(cls.image, cls.imageLoading)}
        aria-busy="true"
        aria-label={label + ' 加载中'}
        style={toDimension(attachment.width) === undefined || toDimension(attachment.height) === undefined
          ? undefined
          : { aspectRatio: toDimension(attachment.width) + ' / ' + toDimension(attachment.height) }}
      >
        <span>加载图片…</span>
      </figure>
    )
  }

  if (src === null || failed) {
    return (
      <figure
        className={cx(cls.image, cls.imageFailed)}
        role="img"
        aria-label={label + ' 加载失败'}
        title={attachment.name}
      >
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2.6 14 13.4H2L8 2.6Z" />
          <path d="M8 6.4v3.2M8 11.3v.6" />
        </svg>
        <span>图片加载失败</span>
      </figure>
    )
  }

  return (
    <figure className={cls.image}>
      <button
        ref={triggerRef}
        type="button"
        className={cls.imageButton}
        title={label}
        aria-label={'查看大图：' + label}
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          alt={label}
          width={toDimension(attachment.width)}
          height={toDimension(attachment.height)}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      </button>
      {caption === '' ? null : <figcaption className={cls.imageCaption}>{caption}</figcaption>}
      {typeof document === 'undefined'
        ? null
        : createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                key="lightbox"
                className={cls.lightbox}
                role="dialog"
                aria-modal="true"
                aria-label={'图片预览：' + label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion() ? 0 : 0.16, ease: 'easeOut' }}
                onClick={close}
              >
                <motion.img
                  className={cls.lightboxImage}
                  src={src}
                  alt={label}
                  initial={{ scale: 0.97, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={spring}
                  onClick={(event) => event.stopPropagation()}
                />
                <button
                  ref={closeRef}
                  type="button"
                  className={cls.lightboxClose}
                  aria-label="关闭预览"
                  title="关闭（Esc）"
                  onClick={(event) => {
                    event.stopPropagation()
                    close()
                  }}
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )}
    </figure>
  )
}
