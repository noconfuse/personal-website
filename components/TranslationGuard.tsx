'use client';

import { useEffect } from 'react';

/**
 * 浏览器翻译插件（Chrome/Edge 自带翻译、沉浸式翻译等）会改写 DOM 文本节点，
 * 导致 React 卸载/更新元素时抛出：
 *   NotFoundError: Failed to execute 'removeChild' on 'Node'
 * 这里打一个业界通用的兜底补丁：当 React 尝试从「错误的父节点」移除子节点时，
 * 把调用重定向到子节点真正的父节点上。
 */
export default function TranslationGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { __translationGuardInstalled?: boolean };
    if (w.__translationGuardInstalled) return;
    w.__translationGuardInstalled = true;

    const origRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
      if (child.parentNode !== this) {
        // 该子节点的真实父节点不是 this（多半被翻译插件移动过）——从真实父节点移除
        if (child.parentNode) {
          return origRemoveChild.call(child.parentNode, child) as T;
        }
        // 节点已不在 DOM 里，视为移除成功，避免抛错打断 React
        return child;
      }
      return origRemoveChild.call(this, child) as T;
    };

    const origInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, reference: Node | null): T {
      if (reference && reference.parentNode !== this) {
        // 参考节点被翻译插件移动过 —— 插到参考节点真实父节点的正确位置
        if (reference.parentNode) {
          return origInsertBefore.call(reference.parentNode, newNode, reference) as T;
        }
        return newNode;
      }
      return origInsertBefore.call(this, newNode, reference) as T;
    };
  }, []);

  return null;
}