export type MyProps = {
  intro_yaml: string,
  sns: Sns[],
  works: Work[]
};

export interface JsonData {
  sns: Sns[];
  works: Work[];
}

export interface Sns {
  name:  string;
  url:   string;
  icon:  string;
  color: string;
}

export interface Work {
  title: string;
  url:  string;
  description: string;
}
