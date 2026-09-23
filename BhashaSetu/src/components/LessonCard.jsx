import { LuArrowRight } from 'react-icons/lu';
import { TODAY_LESSON } from '../data/content';
import { LessonArt } from './Illustrations';

export default function LessonCard({ navigate }) {
  return (
    <section className="panel lesson" aria-labelledby="lc-h">
      <div className="panel__head">
        <h2 id="lc-h" className="panel__title">Today's Lesson</h2>
        <button className="link" onClick={() => navigate('/learn')}>
          View All <LuArrowRight size={14} />
        </button>
      </div>
      <div className="lesson__row">
        <div className="lesson__art">
          <LessonArt />
        </div>
        <div>
          <h3>{TODAY_LESSON.title}</h3>
          <p className="lesson__meta">{TODAY_LESSON.meta}</p>
          <p className="lesson__desc">{TODAY_LESSON.desc}</p>
        </div>
      </div>
      <button className="btn btn--primary lesson__cta" onClick={() => navigate('/learn')}>
        Start Lesson <LuArrowRight className="arrow" size={19} />
      </button>
    </section>
  );
}
