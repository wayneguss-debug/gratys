"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import {
  type FavoriteItem,
  readFavorites,
  writeFavorites
} from "@/lib/favorites";

const kindLabels = {
  post: "Informativo",
  event: "Agenda",
  location: "Local",
  transport: "Transporte"
} as const;

export default function MeuPortalPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const refresh = () => setFavorites(readFavorites());
    refresh();
    window.addEventListener("gratys:favorites", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("gratys:favorites", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const grouped = useMemo(() => {
    return favorites.reduce<Record<string, FavoriteItem[]>>((acc, item) => {
      (acc[item.kind] ??= []).push(item);
      return acc;
    }, {});
  }, [favorites]);

  function remove(item: FavoriteItem) {
    writeFavorites(
      favorites.filter(
        (favorite) => !(favorite.id === item.id && favorite.kind === item.kind)
      )
    );
  }

  function clear() {
    writeFavorites([]);
  }

  return (
    <main id="conteudo">
      <section className="page-hero clean-page-hero">
        <div className="container">
          <div className="hero-icon"><Icon name="bookmark" size={24} /></div>
          <p className="eyebrow">SEU ESPAÇO</p>
          <h1>Meu portal</h1>
          <p>
            Guarde informativos, datas e locais importantes neste navegador.
            Não é necessário criar conta.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-toolbar">
            <div>
              <strong>{favorites.length}</strong>
              <span>{favorites.length === 1 ? "item salvo" : "itens salvos"}</span>
            </div>
            {favorites.length ? (
              <button className="secondary-button" onClick={clear} type="button">
                <Icon name="trash" size={16} />
                Limpar tudo
              </button>
            ) : null}
          </div>

          {favorites.length ? (
            <div className="favorites-sections">
              {(["post", "event", "location", "transport"] as const).map((kind) => {
                const items = grouped[kind] ?? [];
                if (!items.length) return null;

                return (
                  <section className="favorites-group" key={kind}>
                    <div className="simple-section-heading">
                      <h2>{kindLabels[kind]}</h2>
                      <span>{items.length}</span>
                    </div>

                    <div className="favorites-grid">
                      {items.map((item) => (
                        <article className="favorite-card" key={`${item.kind}:${item.id}`}>
                          <Link href={item.href}>
                            <span className="favorite-kind">{kindLabels[item.kind]}</span>
                            <h3>{item.title}</h3>
                            {item.subtitle ? <p>{item.subtitle}</p> : null}
                          </Link>
                          <button
                            aria-label={`Remover ${item.title} dos favoritos`}
                            className="icon-action"
                            onClick={() => remove(item)}
                            type="button"
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="friendly-empty">
              <Icon name="bookmark" size={34} />
              <h2>Você ainda não salvou nada</h2>
              <p>
                Use o botão “Salvar” em informativos, eventos e locais para
                montar sua própria coleção.
              </p>
              <div className="empty-actions">
                <Link className="primary-button" href="/informativos">Ver informativos</Link>
                <Link className="secondary-button" href="/agenda">Abrir agenda</Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
