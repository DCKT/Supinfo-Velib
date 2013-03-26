<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Web\MainBundle\Entity\Favoris;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
	// Page d'accueil
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Page avec GMAP
    public function mapAction($station = null)
    {
        if ($station == null):
            $favoris = new Favoris();
            $form = $this->createFormBuilder($favoris)
                         ->add('nomStation', 'text')
                         ->add('slugNomStation', 'text')
                         ->getForm();
            return $this->render('WebMainBundle:Default:map.html.twig', array(
                'form' => $form->createView(),
            ));
        else:
            $repo = $this->getDoctrine()->getManager()->getRepository("WebMainBundle:Favoris");
            $tmp = $repo->findBySlugNomStation($station);
            return $this->render('WebMainBundle:Default:map.html.twig',array(
                'form' => null
            ));
        endif;
    }

    // Page avec favoris
    public function favorisAction()
    {

        // Current user
        $user = $this->container->get('security.context')->getToken()->getUser();
       
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');

        $favoris = $repo->getUserFavori($user);

        return $this->render('WebMainBundle:Default:favoris.html.twig', array(
             'favoris' => $favoris
        ));
    }

    // Ajout d'un favoris
    public function addFavoriAction()
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $request = $this->get('request');
        $manager = $this->getDoctrine()->getManager();
        $repo = $manager->getRepository('WebMainBundle:Favoris');

        if( $request->getMethod() == 'POST' )
        {
            if (!isset($_POST['form']['slugNomStation']) && !isset($_POST['form']['nomStation'])):
                return new Response('Formulaire vide');
            endif;
            $check = $repo->findBySlugNomStation($_POST['form']['slugNomStation']);
            if ($check != null):
                if ($check[0]->getSlugNomStation() == $_POST['form']['slugNomStation']):
                    $this->get('session')->getFlashBag()->add('notice', 'Cette station est déjà en favoris !');
                    return $this->redirect($this->generateUrl('map'));
                endif;
            endif;

            $favoris = new Favoris();
            $nomStation = $_POST['form']['nomStation'];
            $slugNomStation = $_POST['form']['slugNomStation'];
            $favoris->setNomStation($nomStation);
            $favoris->setSlugNomStation($slugNomStation);
            $favoris->addUser($user);

            $manager->persist($favoris);
            $manager->flush();

            return $this->redirect($this->generateUrl('index'));
        }
        else {
            return new Response('Error');
        }
    }

    public function deleteFavoriAction($id)
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
         // Si l'utilisateur n'est pas connecté, on le redirige
        if (!is_object($user)):
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        endif;

        $em = $this->getDoctrine()->getManager();
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');
        $favoris = $repo->getSpecificUserFavori($user, $id);
        $em->remove($favoris[0]);
        $em->flush();

        return $this->redirect($this->generateUrl('index'));
    }
}
