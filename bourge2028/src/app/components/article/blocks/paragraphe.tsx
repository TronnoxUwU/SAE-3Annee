"use client";
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface ParagrapheHandle {
  applyFormat: (tag: string) => void;
}

interface ParagrapheProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export const Paragraphe = forwardRef<ParagrapheHandle, ParagrapheProps>(
  ({ value, onChange, placeholder = "Écrivez votre texte ici..." }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (divRef.current && divRef.current.innerHTML !== value) {
        divRef.current.innerHTML = value;
      }
    }, [value]);

    const handleInput = () => {
      if (divRef.current) {
        onChange(divRef.current.innerHTML);
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    };

    // ✨ NOUVELLE FONCTION : normalise le HTML pour éviter les balises imbriquées
    const normalizeHTML = (element: HTMLElement) => {
      // Unwrap les balises imbriquées identiques (ex: <strong><strong>text</strong></strong>)
      const unwrapNestedSameTags = (parent: Element) => {
        let changed = true;
        
        // Boucle jusqu'à ce qu'il n'y ait plus de changements
        while (changed) {
          changed = false;
          const elements = Array.from(parent.querySelectorAll('*'));
          
          for (const el of elements) {
            const element = el as HTMLElement;
            const parentEl = element.parentElement;
            
            // Si le parent a le même tag, unwrap
            if (parentEl && 
                parentEl !== divRef.current && 
                parentEl.tagName === element.tagName) {
              // Remplace l'élément par son contenu
              while (element.firstChild) {
                parentEl.insertBefore(element.firstChild, element);
              }
              if (element.parentNode === parentEl) {
                parentEl.removeChild(element);
              }
              changed = true;
              break; // Recommence depuis le début
            }
          }
        }
      };
      
      // Fusionne les balises adjacentes du même type
      const mergeSameTags = (parent: Node) => {
        let changed = true;
        
        // Boucle jusqu'à ce qu'il n'y ait plus de changements
        while (changed) {
          changed = false;
          const children = Array.from(parent.childNodes);
          
          for (let i = 0; i < children.length - 1; i++) {
            const current = children[i];
            const next = children[i + 1];
            
            // Si les deux sont des éléments du même type
            if (current.nodeType === Node.ELEMENT_NODE && 
                next.nodeType === Node.ELEMENT_NODE) {
              const currentEl = current as HTMLElement;
              const nextEl = next as HTMLElement;
              
              if (currentEl.tagName === nextEl.tagName) {
                // Fusionne les deux éléments
                while (nextEl.firstChild) {
                  currentEl.appendChild(nextEl.firstChild);
                }
                if (nextEl.parentNode === parent) {
                  parent.removeChild(nextEl);
                }
                changed = true;
                break; // Recommence depuis le début
              }
            }
          }
        }
        
        // ✨ CORRECTION : Parcourt les enfants APRÈS avoir fini les fusions au niveau actuel
        const children = Array.from(parent.childNodes);
        children.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            mergeSameTags(child);
          }
        });
      };
      
      unwrapNestedSameTags(element);
      mergeSameTags(element);
    };

    // Fonction pour vérifier si un élément contient une balise spécifique
    const containsTag = (element: Node, tagName: string): boolean => {
      if (element.nodeType === Node.ELEMENT_NODE) {
        const el = element as HTMLElement;
        if (el.tagName?.toLowerCase() === tagName.toLowerCase()) {
          return true;
        }
      }
      
      let parent = element.parentElement;
      while (parent && parent !== divRef.current) {
        if (parent.tagName?.toLowerCase() === tagName.toLowerCase()) {
          return true;
        }
        parent = parent.parentElement;
      }
      
      return false;
    };

    // Fonction pour retirer toutes les balises d'un type dans la sélection
    const removeTagFromSelection = (range: Range, tag: string) => {
      const container = range.commonAncestorContainer;
      const div = divRef.current;
      if (!div) return;

      const elements = div.querySelectorAll(tag);
      const toRemove: HTMLElement[] = [];

      elements.forEach((el) => {
        if (range.intersectsNode(el)) {
          toRemove.push(el as HTMLElement);
        }
      });

      toRemove.forEach((el) => {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent?.insertBefore(el.firstChild, el);
        }
        parent?.removeChild(el);
      });
    };

    useImperativeHandle(ref, () => ({
      applyFormat(tag: string) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) {
          alert("Veuillez sélectionner du texte à formater");
          return;
        }
        
        const range = selection.getRangeAt(0);

        if (!divRef.current?.contains(range.commonAncestorContainer)) {
          return;
        }

        const startContainer = range.startContainer;
        const startOffset = range.startOffset;
        const endContainer = range.endContainer;
        const endOffset = range.endOffset;

        const hasTag = containsTag(range.commonAncestorContainer, tag);

        if (hasTag) {
          removeTagFromSelection(range, tag);
        } else {
          try {
            const wrapper = document.createElement(tag);
            range.surroundContents(wrapper);
          } catch {
            const selectedText = selection.toString();
            if (selectedText) {
              const html = `<${tag}>${selectedText}</${tag}>`;
              range.deleteContents();
              const temp = document.createElement('div');
              temp.innerHTML = html;
              const frag = document.createDocumentFragment();
              while (temp.firstChild) {
                frag.appendChild(temp.firstChild);
              }
              range.insertNode(frag);
            }
          }
        }

        // ✨ NOUVEAU : Normalise le HTML après chaque formatage
        if (divRef.current) {
          normalizeHTML(divRef.current);
          onChange(divRef.current.innerHTML);
          
          setTimeout(() => {
            try {
              const newRange = document.createRange();
              newRange.setStart(startContainer, startOffset);
              newRange.setEnd(endContainer, endOffset);
              selection.removeAllRanges();
              selection.addRange(newRange);
            } catch (e) {
              divRef.current?.focus();
            }
          }, 0);
        }
      },
    }), [onChange]);

    return (
      <div
        ref={divRef}
        className="paragraph-contenteditable"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          width: "100%",
          minHeight: "60px",
          outline: "none",
          cursor: "text",
          padding: "8px 0",
          lineHeight: "1.6",
        }}
      />
    );
  }
);

Paragraphe.displayName = "Paragraphe";