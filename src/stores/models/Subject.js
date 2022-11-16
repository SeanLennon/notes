import { uid, date } from "quasar";

export default class Subject {
  constructor({ data }) {
    this.id = data?.id || uid();
    this.title = data.title?.trim() || "";
    this.description = data.description?.trim() || "";
    this.favorite = data.favorite || false;
    this.notes = data.notes || [];
    this.created =
      data.created || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");
    this.updated =
      data.updated || date.formatDate(Date.now(), "YYYY/MM/DD HH:mm");

    this.header = "subject";
    this.icon = "mdi-notebook";
    this.notebook = {
      id: data.notebook?.id || null,
    };
  }

  getCreatedDateTimeFormated(format) {
    return date.formatDate(this.created, format);
  }
  getUpdatedDateTimeFormated(format) {
    return date.formatDate(this.updated, format);
  }

  getNotesCount() {
    return this.notes.length;
  }

  getType() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      notebook: {
        id: this.notebook.id,
      },
    };
  }
}
