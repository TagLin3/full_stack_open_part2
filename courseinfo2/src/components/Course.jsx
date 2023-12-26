const CourseHeader = ({ course }) => <h2>{course}</h2>;

const Total = ({ sum }) => <p>Number of exercises {sum}</p>;

const Part = ({ part }) => (
  <li>
    {part.name} {part.exercises}
  </li>
);

const Content = ({ parts }) => <ul>{parts}</ul>;

const Course = ({ course }) => {
  return (
    <div>
      <CourseHeader course={course.name} />
      <Content
        parts={course.parts.map((part) => (
          <Part key={part.id} part={part} />
        ))}
      />
      <Total
        sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
      />
    </div>
  );
};

export default Course;
