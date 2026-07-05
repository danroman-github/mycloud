from django.views.generic import TemplateView


class SPAView(TemplateView):
    """
    Отдаёт index.html для всех SPA-маршрутов.
    Это нужно, чтобы React Router мог работать с прямыми ссылками.
    """
    template_name = 'index.html'