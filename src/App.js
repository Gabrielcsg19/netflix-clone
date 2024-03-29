// Parei no minuto 2:13:13 do vídeo no Youtube

import React, { useEffect, useState } from 'react';

import './App.css';
import FeatureMovie from './components/FeaturedMovie';
import MovieRow from './components/MovieRow';
import Tmdb from './Tmdb';
import Header from './components/Header';

// eslint-disable-next-line
export default () => {
    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista total
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // Pegando o featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1))
            let chosen = originals[0].items.results[randomChosen];

            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(()=> {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        <div className="page">

            <Header black={blackHeader} />

            {featuredData &&
                <FeatureMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito com <span role="img" aria-label="coração">&#10084;&#65039;</span> pela B7Web <br/>
                Direitos de imagem para Netflix <br/>
                Dados pegos do site Themoviedb.org
            </footer>

            {(movieList.length <= 0 && featuredData === null) &&
                <div className="loading">
                    <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="Carregando" />
                </div>
            }
        </div>
    );
}